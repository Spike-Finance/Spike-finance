"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const morgan_1 = __importDefault(require("morgan"));
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const logger = new common_1.Logger('MAIN');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.use((0, morgan_1.default)('combined'));
    app.enableCors({
        origin: ['https://spike-admin.vercel.app', 'http://localhost:3000'],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization", 'Upload-Offset', 'Upload-Length', 'Tus-Resumable', 'Upload-Metadata'],
        credentials: true,
    });
    const config = app.get(config_1.ConfigService);
    const port = config.get('PORT', 8000);
    const documentBuilder = new swagger_1.DocumentBuilder()
        .setTitle('Spike API')
        .setDescription('Spike API Documentation')
        .setVersion('1.0')
        .build();
    const document = () => swagger_1.SwaggerModule.createDocument(app, documentBuilder);
    swagger_1.SwaggerModule.setup('documentation', app, document);
    await app.listen(port, () => logger.log(`🚀 Application is running on: ${port}`));
}
bootstrap();
//# sourceMappingURL=main.js.map