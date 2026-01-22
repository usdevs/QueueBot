-- CreateTable
CREATE TABLE "Organiser" (
    "id" SERIAL NOT NULL,
    "telegram_id" INTEGER NOT NULL,

    CONSTRAINT "Organiser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueueConfig" (
    "id" INTEGER NOT NULL,
    "positionBeforePing" INTEGER NOT NULL,
    "isOpen" BOOLEAN NOT NULL,

    CONSTRAINT "QueueConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Queue" (
    "telegram_id" INTEGER NOT NULL,
    "timeCreated" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Organiser_telegram_id_key" ON "Organiser"("telegram_id");

-- CreateIndex
CREATE UNIQUE INDEX "Queue_telegram_id_key" ON "Queue"("telegram_id");
