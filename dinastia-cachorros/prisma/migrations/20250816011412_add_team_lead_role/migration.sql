-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_advisors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "teamLeadId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "advisors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "advisors_teamLeadId_fkey" FOREIGN KEY ("teamLeadId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_advisors" ("code", "createdAt", "id", "updatedAt", "userId") SELECT "code", "createdAt", "id", "updatedAt", "userId" FROM "advisors";
DROP TABLE "advisors";
ALTER TABLE "new_advisors" RENAME TO "advisors";
CREATE UNIQUE INDEX "advisors_userId_key" ON "advisors"("userId");
CREATE UNIQUE INDEX "advisors_code_key" ON "advisors"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
