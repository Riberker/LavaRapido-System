/*
  Warnings:

  - Changed the type of `descricao` on the `Registro` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TipoServico" AS ENUM ('LAVAGEM_SIMPLES', 'LAVAGEM_SIMPLES_CERA', 'LAVAGEM_SIMPLES_POR_BAIXO', 'LAVAGEM_COMPLETA_MOTOR');

-- AlterTable
ALTER TABLE "Registro" DROP COLUMN "descricao",
ADD COLUMN     "descricao" "TipoServico" NOT NULL;
