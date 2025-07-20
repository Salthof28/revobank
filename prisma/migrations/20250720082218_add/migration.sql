/*
  Warnings:

  - You are about to drop the column `transaction_ref` on the `transactions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[number_transaction_ref]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code_transaction_ref` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CodeTypeTransaction" AS ENUM ('TR', 'DP', 'WH');

-- DropIndex
DROP INDEX "transactions_transaction_ref_key";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "transaction_ref",
ADD COLUMN     "code_transaction_ref" "CodeTypeTransaction" NOT NULL,
ADD COLUMN     "number_transaction_ref" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "transactions_number_transaction_ref_key" ON "transactions"("number_transaction_ref");
