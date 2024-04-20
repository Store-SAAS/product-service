import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
	private readonly logger = new Logger('ProductsService');

	onModuleInit() {
		this.$connect();
		this.logger.log('Database connected');
	}

	async createProduct(createProductDto: CreateProductDto) {
		return this.product.create({
			data: {
				...createProductDto,
				description: createProductDto.description || '',
			},
		});
	}

	async getProducts(paginationDto: PaginationDto) {
		const { page, limit } = paginationDto;

		const totalPages = await this.product.count({ where: { available: true } });
		const lastPage = Math.ceil(totalPages / limit);

		const data = await this.product.findMany({
			skip: (page - 1) * limit,
			take: limit,
			where: {
				available: true,
			},
		});

		return {
			data: data,
			meta: {
				total: totalPages,
				page: page,
				lastPage: lastPage,
			},
		};
	}

	async getProduct(id: string) {
		const product = await this.product.findFirst({
			where: { id, available: true },
		});

		if (!product) {
			throw new RpcException({
				message: `Product with id ${id} not found`,
				status: HttpStatus.NOT_FOUND,
			});
		}
		return product;
	}

	async updateProduct(id: string, updateProductDto: UpdateProductDto) {
		const { id: __, ...data } = updateProductDto;

		await this.getProduct(id);

		return await this.product.update({
			where: { id },
			data: data,
		});
	}

	async deleteProduct(id: string) {
		await this.getProduct(id);

		return await this.product.update({
			where: { id },
			data: {
				available: false,
			},
		});
	}

	async validateProducts(ids: string[]) {
		ids = Array.from(new Set(ids));
		const products = await this.product.findMany({
			where: {
				id: {
					in: ids,
				},
			},
		});

		if (products.length !== ids.length) {
			this.logger.error(`Some products were not found`);
			throw new RpcException({
				status: HttpStatus.NOT_FOUND,
				message: 'Some products were not found',
			});
		}

		return products;
	}
}
