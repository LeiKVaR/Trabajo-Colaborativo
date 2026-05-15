const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTasks() {
  const count = await prisma.$queryRaw`
    SELECT COUNT(*) FROM tasks JOIN task_assignments ON tasks.id = task_assignments."taskId" WHERE task_assignments."userId" = 'cmowj30q30000baep4rb1iy8u' AND tasks.status IN ('ASSIGNED', 'IN_PROGRESS');
  `;
  const rows = await prisma.$queryRaw`
    SELECT tasks.title, tasks.status FROM tasks JOIN task_assignments ON tasks.id = task_assignments."taskId" WHERE task_assignments."userId" = 'cmowj30q30000baep4rb1iy8u' AND tasks.status IN ('ASSIGNED', 'IN_PROGRESS');
  `;
  console.log("Count:", count);
  console.log("Rows:", rows);
  await prisma.$disconnect();
}

checkTasks().catch(console.error);
