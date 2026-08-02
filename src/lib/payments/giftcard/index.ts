export const processGiftCardPayment = async (
  code: string,
  amount: number
): Promise<{ success: boolean; balance: number }> => {
  // Gift card payment processing
  // In production, this would query the database for the gift card
  // and validate the balance
  return {
    success: true,
    balance: 0,
  };
};

export const validateGiftCard = (code: string): { valid: boolean; balance?: number } => {
  // In production, this would validate against the database
  return { valid: false };
};
