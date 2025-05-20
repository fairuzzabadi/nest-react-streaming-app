-- DropIndex
DROP INDEX "RefreshToken_ipAddress_userAgent_key";

-- AlterTable
ALTER TABLE "RefreshToken" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
