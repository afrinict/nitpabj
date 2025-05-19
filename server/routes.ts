import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import {
  insertProfileSchema,
  insertQualificationSchema,
  insertEmploymentSchema,
  insertComplaintSchema,
  insertApplicationSchema,
  insertFinancialRecordSchema
} from "@shared/schema";

// Auth middleware
function isAuthenticated(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

function hasRole(roles: string[]) {
  return (req: Request, res: Response, next: Function) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (roles.includes(req.user!.role)) {
      return next();
    }
    
    res.status(403).json({ message: "Forbidden: Insufficient permissions" });
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // Member Directory
  app.get("/api/members", isAuthenticated, async (req, res) => {
    try {
      const search = req.query.search as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const members = await storage.getMembers(search, limit, offset);
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Error fetching members" });
    }
  });
  
  // Executive Committee
  app.get("/api/executives", async (req, res) => {
    try {
      const executives = await storage.getExecutiveMembers();
      res.json(executives);
    } catch (error) {
      res.status(500).json({ message: "Error fetching executive members" });
    }
  });
  
  // Profile Management
  app.get("/api/profile/:userId", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Allow users to only view their own profile, unless they're admin
      if (req.user!.id !== userId && req.user!.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const profile = await storage.getProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Error fetching profile" });
    }
  });
  
  app.put("/api/profile", isAuthenticated, async (req, res) => {
    try {
      const data = insertProfileSchema.parse(req.body);
      
      const existingProfile = await storage.getProfile(req.user!.id);
      
      let profile;
      if (existingProfile) {
        profile = await storage.updateProfile(req.user!.id, data);
      } else {
        profile = await storage.createProfile({
          ...data,
          userId: req.user!.id
        });
      }
      
      res.json(profile);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Error updating profile" });
    }
  });
  
  // Qualifications
  app.get("/api/qualifications/:userId", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const qualifications = await storage.getQualifications(userId);
      res.json(qualifications);
    } catch (error) {
      res.status(500).json({ message: "Error fetching qualifications" });
    }
  });
  
  app.post("/api/qualifications", isAuthenticated, async (req, res) => {
    try {
      const data = insertQualificationSchema.parse(req.body);
      
      // Ensure userId matches the authenticated user
      if (data.userId !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const qualification = await storage.addQualification(data);
      res.status(201).json(qualification);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Error adding qualification" });
    }
  });
  
  app.delete("/api/qualifications/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.deleteQualification(id);
      if (result) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Qualification not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error deleting qualification" });
    }
  });
  
  // Employment
  app.get("/api/employment/:userId", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const employments = await storage.getEmploymentHistory(userId);
      res.json(employments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching employment history" });
    }
  });
  
  app.post("/api/employment", isAuthenticated, async (req, res) => {
    try {
      const data = insertEmploymentSchema.parse(req.body);
      
      // Ensure userId matches the authenticated user
      if (data.userId !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const employment = await storage.addEmployment(data);
      res.status(201).json(employment);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Error adding employment" });
    }
  });
  
  app.delete("/api/employment/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.deleteEmployment(id);
      if (result) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Employment record not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error deleting employment record" });
    }
  });
  
  // Ethics Complaints
  app.get("/api/complaints", hasRole(['admin', 'ethics_officer']), async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const complaints = await storage.getComplaints(status);
      res.json(complaints);
    } catch (error) {
      res.status(500).json({ message: "Error fetching complaints" });
    }
  });
  
  app.get("/api/complaints/user", isAuthenticated, async (req, res) => {
    try {
      const complaints = await storage.getUserComplaints(req.user!.id);
      res.json(complaints);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user complaints" });
    }
  });
  
  app.get("/api/complaints/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const complaint = await storage.getComplaintById(id);
      
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }
      
      // Check if user is authorized to view this complaint
      const isAuthorized = 
        req.user!.role === 'admin' || 
        req.user!.role === 'ethics_officer' || 
        complaint.complainantId === req.user!.id || 
        complaint.respondentId === req.user!.id;
        
      if (!isAuthorized) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(complaint);
    } catch (error) {
      res.status(500).json({ message: "Error fetching complaint" });
    }
  });
  
  app.post("/api/complaints", async (req, res) => {
    try {
      const data = insertComplaintSchema.parse(req.body);
      
      let userId: number | undefined;
      if (req.isAuthenticated()) {
        userId = req.user!.id;
      }
      
      const complaint = await storage.createComplaint(data, userId);
      res.status(201).json(complaint);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Error creating complaint" });
    }
  });
  
  app.patch("/api/complaints/:id/status", hasRole(['admin', 'ethics_officer']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const updated = await storage.updateComplaintStatus(id, status, req.user!.id);
      
      if (!updated) {
        return res.status(404).json({ message: "Complaint not found" });
      }
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Error updating complaint status" });
    }
  });
  
  // Applications
  app.get("/api/applications/user", isAuthenticated, async (req, res) => {
    try {
      const applications = await storage.getUserApplications(req.user!.id);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Error fetching applications" });
    }
  });
  
  app.get("/api/applications/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const application = await storage.getApplicationById(id);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      // Check if user is authorized to view this application
      const isAuthorized = 
        req.user!.role === 'admin' || 
        application.userId === req.user!.id;
        
      if (!isAuthorized) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: "Error fetching application" });
    }
  });
  
  app.post("/api/applications", isAuthenticated, async (req, res) => {
    try {
      const data = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(data, req.user!.id);
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Error creating application" });
    }
  });
  
  app.patch("/api/applications/:id/status", hasRole(['admin']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const updated = await storage.updateApplicationStatus(id, status);
      
      if (!updated) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Error updating application status" });
    }
  });
  
  // Financial Records
  app.get("/api/financial-records", hasRole(['admin', 'financial_officer']), async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      
      const records = await storage.getFinancialRecords(category, limit);
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Error fetching financial records" });
    }
  });
  
  app.post("/api/financial-records", hasRole(['admin', 'financial_officer']), async (req, res) => {
    try {
      const data = insertFinancialRecordSchema.parse(req.body);
      const record = await storage.createFinancialRecord({
        ...data,
        createdBy: req.user!.id
      });
      res.status(201).json(record);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Error creating financial record" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
