import { PrismaClient } from "@prisma/client/extension";

const prisma  = new PrismaClient();

export const registerUser = async(req, res) =>{
    console.log('user registerd');
    await prisma.user.findUnique({
        where: {email}
    })
};