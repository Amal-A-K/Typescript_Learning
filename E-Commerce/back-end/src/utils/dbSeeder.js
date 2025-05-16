import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

export const seedAdminUser = async () => {
    try {
        // Check if admin user already exists
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@ecommerce.com';
        const adminExists = await User.findOne({ email: adminEmail });

        if (!adminExists) {
            const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            const adminUser = new User({
                name: 'Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            });

            await adminUser.save();
            console.log('Default admin user created successfully');
        } else {
            console.log('Admin user already exists');
        }
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
};
