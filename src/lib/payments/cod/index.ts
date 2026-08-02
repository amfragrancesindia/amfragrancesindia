export const processCODOrder = async (orderData: {
  orderNumber: string;
  amount: number;
}): Promise<{ success: boolean; orderId: string }> => {
  // COD orders don't require payment processing
  return {
    success: true,
    orderId: orderData.orderNumber,
  };
};

export const validateCODAvailability = (pincode: string): boolean => {
  // For now, COD is available for all pincodes
  // In production, this would check against a serviceable pincode database
  return true;
};
