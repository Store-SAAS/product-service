import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@MessagePattern({ cmd: 'createProduct' })
	createProduct(@Payload() createProductDto: CreateProductDto) {
		return this.productsService.create(createProductDto);
	}

	@MessagePattern({ cmd: 'getProducts' })
	getProducts(@Payload() paginationDto: PaginationDto) {
		return this.productsService.findAll(paginationDto);
	}

	@MessagePattern({ cmd: 'getProduct' })
	getProduct(@Payload('id', ParseUUIDPipe) id: string) {
		return this.productsService.findOne(id);
	}

	@MessagePattern({ cmd: 'updateProduct' })
	updateProduct(@Payload() updateProductDto: UpdateProductDto) {
		return this.productsService.update(updateProductDto.id, updateProductDto);
	}

	@MessagePattern({ cmd: 'deleteProduct' })
	deleteProduct(@Payload('id', ParseUUIDPipe) id: string) {
		return this.productsService.remove(id);
	}
}
