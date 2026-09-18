// const prisma = require('@prisma/client'); 
// const prismaClient = new prisma.PrismaClient();
const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();

module.exports = prismaClient;