import { Controller, Logger, ParseUUIDPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
	private logger = new Logger('ProductsController');

	constructor(private readonly productsService: ProductsService) {}

	@MessagePattern({ cmd: 'getProducts' })
	getProducts(@Payload() paginationDto: PaginationDto) {
		this.logger.log(`Retrieving products with ${JSON.stringify(paginationDto)}`);
		return this.productsService.getProducts(paginationDto);
	}

	@MessagePattern({ cmd: 'getProduct' })
	getProduct(@Payload('id', ParseUUIDPipe) id: string) {
		this.logger.log(`Retrieving product with id ${id}`);
		return this.productsService.getProduct(id);
	}

	@MessagePattern({ cmd: 'createProduct' })
	createProduct(@Payload() createProductDto: CreateProductDto) {
		this.logger.log(`Creating product`);
		return this.productsService.createProduct(createProductDto);
	}

	@MessagePattern({ cmd: 'updateProduct' })
	updateProduct(@Payload() updateProductDto: UpdateProductDto) {
		this.logger.log(`Updating product with id ${updateProductDto.id}`);
		return this.productsService.updateProduct(updateProductDto.id, updateProductDto);
	}

	@MessagePattern({ cmd: 'deleteProduct' })
	deleteProduct(@Payload('id', ParseUUIDPipe) id: string) {
		this.logger.log(`Deleting product with id ${id}`);
		return this.productsService.deleteProduct(id);
	}

	@MessagePattern({ cmd: 'validateProducts' })
	validateProducts(@Payload() ids: string[]) {
		this.logger.log(`Validating products with ids ${ids}`);
		return this.productsService.validateProducts(ids);
	}
}
