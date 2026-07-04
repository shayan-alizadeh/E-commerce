import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client.js';

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Start seeding roles and permissions...');

  const roles = ['admin', 'support', 'warehouse', 'accounting'];

  for (const roleName of roles) {
    const seedRole = await prisma.roles.upsert({
      where: { name: roleName },
      update: {},
      create: {
        name: roleName,
      },
    });
    console.log(`✅ Role upserted: ${seedRole.name}`);
  }

  console.log('-----------------------------------');

  const permissions = [
    // Resource: warehouse (انبار)
    'role:create',
    'role:read',
    'role:update',
    'role:delete',

    // Resource: accounting (حسابداری)
    'product:create',
    'product:read',
    'product:update',
    'product:delete',
    'product:report', // اکشن اختصاصی برای گزارش‌گیری

    // Resource: ticket (تیکت‌های پشتیبانی)
    'ticket:create',
    'ticket:read',
    'ticket:answer',
    'ticket:close',

    // Resource: user (مدیریت کاربران)
    'user:create',
    'user:read',
    'user:update',
    'user:delete',

    // دسترسی کامل برای ادمین کل (معمولاً با *:* یا all:all نشان داده می‌شود)
    '*:*', // Resource: warehouse (انبار)
  ];

  for (const permissionName of permissions) {
    const seedPermission = await prisma.permissions.upsert({
      where: { name: permissionName },
      update: {},
      create: {
        name: permissionName,
      },
    });
    console.log(`✅ Permission upserted: ${seedPermission.name}`);
  }

  console.log('🎉 Seeding finished successfully.');

  console.log('-----------------------------------');

  console.log('🔗 Linking Admin role to *:* permission...');

  // ۱. پیدا کردن ID نقش ادمین و پرمیشن کل
  const adminRole = await prisma.permissions.findUnique({
    where: { name: 'admin' },
  });
  const superAdminPermission = await prisma.permissions.findUnique({
    where: { name: '*:*' },
  });

  // ۲. اگر هر دو پیدا شدند، در جدول واسط آن‌ها را به هم متصل کن
  if (adminRole && superAdminPermission) {
    // نکته: نام متد role_permission و فیلدهای roleId/permissionId بستگی به نام‌گذاری شما در schema.prisma دارد
    await prisma.role_permission.upsert({
      where: {
        // فرض بر این است که یک کلید ترکیبی یونیک برای این دو فیلد دارید
        role_id_permission_id: {
          role_id: adminRole.id,
          permission_id: superAdminPermission.id,
        },
      },
      update: {},
      create: {
        role_id: adminRole.id,
        permission_id: superAdminPermission.id,
      },
    });
    console.log('✅ Admin successfully linked to *:* permission.');
  }
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
