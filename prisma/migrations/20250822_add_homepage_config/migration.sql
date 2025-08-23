-- CreateTable
CREATE TABLE "HomepageConfig" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "data" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "HomepageConfig_pkey" PRIMARY KEY ("id")
);



