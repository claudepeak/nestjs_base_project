import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly prisma: PrismaClient;

  constructor() {
    super();
    this.prisma = new PrismaClient();
  }

  get client() {
    return this.prisma;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    app.enableShutdownHooks(); // Uygulama kapatma olaylarını etkinleştirin

    // Uygulama kapatıldığında çalışacak kodu belirleyin
    process.on('beforeExit', async () => {
      await this.$disconnect();
      await app.close();
    });
  }
}
