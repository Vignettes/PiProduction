-- CreateTable
CREATE TABLE "SongAnalysis" (
    "id" SERIAL NOT NULL,
    "songId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SongAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SongAnalysis_songId_key" ON "SongAnalysis"("songId");
