-- CreateTable
CREATE TABLE "NFTMint" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NFTMint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NFTCollection" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "whitelistOnly" BOOLEAN NOT NULL,
    "maxMintsPerWallet" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NFTCollection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NFTMint_address_key" ON "NFTMint"("address");

-- CreateIndex
CREATE UNIQUE INDEX "NFTCollection_address_chainId_key" ON "NFTCollection"("address", "chainId");
