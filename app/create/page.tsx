"use client";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { contracts, NFTFactoryABI } from "@/config/contracts";
import { parseEther, isAddress } from "viem";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UploadImage from "./upload-img";
import { decodeEventLog } from "viem";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { FormValues } from "./types";

const formSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    maxSupply: z
      .string()
      .min(1, "Max supply is required")
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Max supply must be a positive number",
      }),
    mintPrice: z
      .string()
      .min(1, "Mint price is required")
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Mint price must be a non-negative number",
      }),
    imageUrl: z.string().url("Must be a valid URL"),
    whitelistOnly: z.boolean().default(false),
    initialWhitelist: z.string().optional(),
    maxMintsPerWallet: z
      .string()
      .min(1, "Max mints per wallet is required")
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Max mints per wallet must be a positive number",
      }),
    mintStartTime: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true; // 如果没有值，通过验证
          const startTime = new Date(val).getTime();
          return startTime > Date.now();
        },
        {
          message: "Start time must be in the future",
        }
      ),
    mintEndTime: z.string().optional(),
  })
  .refine(
    (data) => {
      if (
        data.whitelistOnly &&
        (!data.initialWhitelist || data.initialWhitelist.trim() === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Whitelist addresses are required when whitelist only is enabled",
      path: ["initialWhitelist"],
    }
  )
  .refine(
    (data) => {
      if (data.initialWhitelist) {
        const addresses = data.initialWhitelist.split(",");
        return addresses.every((address) => isAddress(address.trim()));
      }
      return true;
    },
    {
      message:
        "Invalid Ethereum addresses format. Use comma-separated addresses",
      path: ["initialWhitelist"],
    }
  )
  .refine(
    (data) => {
      if (data.mintStartTime && data.mintEndTime) {
        const startTime = new Date(data.mintStartTime).getTime();
        const endTime = new Date(data.mintEndTime).getTime();
        return endTime > startTime;
      }
      return true;
    },
    {
      message: "End time must be after start time",
      path: ["mintEndTime"],
    }
  );

export default function CreateCollection() {
  const { isConnected } = useAccount();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      whitelistOnly: false,
      mintPrice: "0",
      maxMintsPerWallet: "1",
    },
  });
  const {
    writeContract,
    isPending: isWritePending,
    data: hash,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    data: receipt,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [collectionAddress, setCollectionAddress] = useState<string>();
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (isConfirmed && hash && receipt) {
      try {
        const event = receipt.logs
          .map((log) => {
            try {
              return decodeEventLog({
                abi: NFTFactoryABI,
                data: log.data,
                topics: log.topics,
              });
            } catch {
              return undefined;
            }
          })
          .find((event) => event?.eventName === "CollectionCreated");

        if (event) {
          const { collection } = event.args as { collection: `0x${string}` }
          setCollectionAddress(collection);
          setShowSuccessDialog(true);
        }
      } catch (error) {
        console.error("Failed to parse event:", error);
      }
    }
  }, [isConfirmed, hash, receipt]);

  useEffect(() => {
    if (confirmError) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [confirmError]);

  function onSubmit(values: FormValues) {
    const mintStartTime = values.mintStartTime
      ? Math.floor(new Date(values.mintStartTime).getTime() / 1000)
      : 0;
    const mintEndTime = values.mintEndTime
      ? Math.floor(new Date(values.mintEndTime).getTime() / 1000)
      : 0;

    writeContract({
      abi: NFTFactoryABI,
      functionName: "createCollection",
      address: contracts.sepolia.NFTFactory,
      args: [
        values.name,
        values.description,
        BigInt(values.maxSupply),
        parseEther(values.mintPrice),
        values.imageUrl,
        values.whitelistOnly,
        values.whitelistOnly && values.initialWhitelist
          ? values.initialWhitelist
              .split(",")
              .map((addr) => addr.trim())
              .map((addr) => addr as `0x${string}`)
          : [],
        BigInt(values.maxMintsPerWallet),
        BigInt(mintStartTime),
        BigInt(mintEndTime),
      ],
    });
  }

  const getButtonText = () => {
    if (isWritePending) return "Confirming Transaction...";
    if (isConfirming) return "Creating Collection...";
    return "Create Collection";
  };

  return (
    <div className="mx-auto container max-w-5xl min-h-screen p-8">
      <div className="container max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create NFT Collection</h1>
          <p className="text-muted-foreground">
            Deploy your own NFT collection contract
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome NFTs" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your NFT collection"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="maxSupply"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Supply</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mintPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mint Price (ETH)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => <UploadImage field={field} />}
            />

            <FormField
              control={form.control}
              name="whitelistOnly"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Whitelist Only</FormLabel>
                    <FormDescription>
                      Only whitelisted addresses can mint NFTs
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("whitelistOnly") && (
              <FormField
                control={form.control}
                name="initialWhitelist"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Whitelist</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="0x1234...,0x5678... (comma-separated addresses)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter Ethereum addresses separated by commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="maxMintsPerWallet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Mints Per Wallet</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="mintStartTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mint Start Time (Optional)</FormLabel>
                    <FormControl>
                      <div
                        className="relative"
                        onClick={() => {
                          const input = document.querySelector(
                            'input[name="mintStartTime"]'
                          ) as HTMLInputElement;
                          if (input) {
                            input.showPicker();
                          }
                        }}
                      >
                        <Input type="datetime-local" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mintEndTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mint End Time (Optional)</FormLabel>
                    <FormControl>
                      <div
                        className="relative"
                        onClick={() => {
                          const input = document.querySelector(
                            'input[name="mintEndTime"]'
                          ) as HTMLInputElement;
                          if (input) {
                            input.showPicker();
                          }
                        }}
                      >
                        <Input type="datetime-local" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <Button
                type="submit"
                className="w-full"
                disabled={isWritePending || isConfirming || !isConnected}
              >
                {getButtonText()}
              </Button>
              {!isConnected && (
                <p className="text-sm text-muted-foreground text-center">
                  Please connect your wallet first
                </p>
              )}
            </div>
          </form>
        </Form>

        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Collection Created Successfully!</DialogTitle>
              <DialogDescription>
                Your NFT collection has been created. You can view the details
                below.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {collectionAddress && (
                <Link href={`/collection/${collectionAddress}`}>
                  <Button className="w-full">View Collection Details</Button>
                </Link>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {showError && confirmError && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>Error: {confirmError.message}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
