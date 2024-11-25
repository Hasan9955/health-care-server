/*
  Warnings:

  - You are about to drop the `doctor_specialities` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "doctor_specialities" DROP CONSTRAINT "doctor_specialities_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_specialities" DROP CONSTRAINT "doctor_specialities_specialitiesId_fkey";

-- DropTable
DROP TABLE "doctor_specialities";

-- CreateTable
CREATE TABLE "doctor_specialties" (
    "specialtiesId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,

    CONSTRAINT "doctor_specialties_pkey" PRIMARY KEY ("specialtiesId","doctorId")
);

-- AddForeignKey
ALTER TABLE "doctor_specialties" ADD CONSTRAINT "doctor_specialties_specialtiesId_fkey" FOREIGN KEY ("specialtiesId") REFERENCES "Specialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_specialties" ADD CONSTRAINT "doctor_specialties_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
