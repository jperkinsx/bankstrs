import { z } from "zod";

export const bankstrTraitsSchema = z.object({
  background: z.string(),
  base: z.string(),
  eyes: z.string(),
  head: z.string(),
  outfit: z.string(),
  accessory: z.string(),
});

export const bankstrSchema = z.object({
  day: z.number(),
  seed: z.string(),
  traits: bankstrTraitsSchema,
  imageUrl: z.string(),
  owner: z.string().nullable(),
  auctionEndTime: z.number(),
  highestBid: z.string(),
  highestBidder: z.string().nullable(),
  settled: z.boolean(),
});

export const statsSchema = z.object({
  currentDay: z.number(),
  totalMinted: z.number(),
});

export type BankstrTraits = z.infer<typeof bankstrTraitsSchema>;
export type Bankstr = z.infer<typeof bankstrSchema>;
export type Stats = z.infer<typeof statsSchema>;
