export interface FormValues {
  imageUrl: string;
  name: string;
  description: string;
  maxSupply: string;
  mintPrice: string;
  whitelistOnly: boolean;
  maxMintsPerWallet: string;
  initialWhitelist?: string;
  mintStartTime?: string;
  mintEndTime?: string;
  mintPeriod?: {
    from?: Date;
    to?: Date;
  };
} 