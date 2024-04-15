import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';

import { AppModule } from './app.module';
import { envs } from './config';

async function bootstrap() {
	const logger = new Logger('Main');

	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix('api');
	app.enableCors();
	app.use(compression());

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
		}),
	);
	await app.listen(envs.port);
	logger.log(`Product service running on port ${envs.port}`);
}
bootstrap();
