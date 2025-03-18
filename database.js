const fs = require('fs').promises;
const path = require('path');

class Database {
  constructor() {
    this.usersFile = path.join(__dirname, 'data', 'users.txt');
    this.init();
  }

  async init() {
    try {
      // สร้างโฟลเดอร์ data ถ้ายังไม่มี
      const dataDir = path.join(__dirname, 'data');
      try {
        await fs.access(dataDir);
      } catch {
        await fs.mkdir(dataDir);
      }

      // สร้างไฟล์ users.txt ถ้ายังไม่มี
      try {
        await fs.access(this.usersFile);
      } catch {
        await fs.writeFile(this.usersFile, '');
      }
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  async getAllUsers() {
    try {
      const data = await fs.readFile(this.usersFile, 'utf8');
      return data.split('\n').filter(Boolean);
    } catch (error) {
      console.error('Error reading users:', error);
      return [];
    }
  }

  async addUser(username) {
    try {
      const users = await this.getAllUsers();
      if (!users.includes(username)) {
        await fs.appendFile(this.usersFile, `${username}\n`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding user:', error);
      return false;
    }
  }

  async findUser(username) {
    try {
      const users = await this.getAllUsers();
      return users.includes(username);
    } catch (error) {
      console.error('Error finding user:', error);
      return false;
    }
  }

  async deleteUser(username) {
    try {
      const users = await this.getAllUsers();
      const filteredUsers = users.filter(user => user !== username);
      await fs.writeFile(this.usersFile, filteredUsers.join('\n') + '\n');
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }
}

module.exports = new Database(); 