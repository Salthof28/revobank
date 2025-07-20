/*
  Warnings:

  - A unique constraint covering the columns `[transaction_ref]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - Made the column `account_id` on table `transactions` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `transaction_ref` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "account_id" SET NOT NULL,
DROP COLUMN "transaction_ref",
ADD COLUMN     "transaction_ref" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "transactions_transaction_ref_key" ON "transactions"("transaction_ref");
