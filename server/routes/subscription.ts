import { Router } from 'express';
import { db } from '../db';
import { memberSubscriptions, creditTransactions } from '../../shared/schema';
import { eq, and, desc } from 'drizzle-orm';
import { z } from 'zod';

const router = Router();

// Get current subscription
router.get('/current', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const subscription = await db.query.memberSubscriptions.findFirst({
      where: and(
        eq(memberSubscriptions.userId, userId),
        eq(memberSubscriptions.status, 'active')
      ),
      orderBy: [desc(memberSubscriptions.endDate)]
    });

    res.json(subscription);
  } catch (error) {
    console.error('Error fetching current subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get subscription history
router.get('/history', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const history = await db.query.memberSubscriptions.findMany({
      where: eq(memberSubscriptions.userId, userId),
      orderBy: [desc(memberSubscriptions.startDate)]
    });

    res.json(history);
  } catch (error) {
    console.error('Error fetching subscription history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Renew subscription
const renewSchema = z.object({
  paymentMethod: z.enum(['card', 'transfer']),
  amount: z.number()
});

router.post('/renew', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { paymentMethod, amount } = renewSchema.parse(req.body);

    // Create a new subscription record
    const [subscription] = await db.insert(memberSubscriptions).values({
      userId,
      status: 'pending',
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      amount,
      paymentStatus: 'pending',
      receiptNumber: `REC-${Date.now()}`
    }).returning();

    // Create a credit transaction record
    await db.insert(creditTransactions).values({
      userId,
      amount: -amount,
      type: 'subscription',
      description: 'Annual subscription renewal',
      paymentStatus: 'pending'
    });

    // Generate payment URL based on payment method
    const paymentUrl = paymentMethod === 'card'
      ? `/api/payments/card/${subscription.id}`
      : `/api/payments/transfer/${subscription.id}`;

    res.json({ paymentUrl });
  } catch (error) {
    console.error('Error processing subscription renewal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify payment status
router.get('/verify/:subscriptionId', async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const subscription = await db.query.memberSubscriptions.findFirst({
      where: and(
        eq(memberSubscriptions.id, subscriptionId),
        eq(memberSubscriptions.userId, userId)
      )
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json({ status: subscription.paymentStatus });
  } catch (error) {
    console.error('Error verifying payment status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 