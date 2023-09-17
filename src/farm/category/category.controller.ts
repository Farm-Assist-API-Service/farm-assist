import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/utils/filters/http-exception.filter';
import { LoggingInterceptor } from 'src/utils/interceptors/logging.interceptor';
import { TransformInterceptor } from 'src/utils/interceptors/transform.interceptor';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category-dto';
import { FarmCategory } from './entities/category.entity';
import { Category } from './interfaces';
import { PaginateDto } from 'src/core/dtos/paginate.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRoles } from 'src/core/enums/roles.enum';
import { Roles } from 'src/utils/decorators/roles.decorator';

@Controller('api/farm')
@UseInterceptors(TransformInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@UseFilters(HttpExceptionFilter)
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  // @Roles(UserRoles.ADMIN)
  @Post('category')
  create(@Body() inputs: CreateCategoryDto): Promise<FarmCategory> {
    return this.categoryService.create(inputs);
  }

  @Get('category')
  getCategories(@Query() paginateDto: PaginateDto): Promise<Category[]> {
    return this.categoryService.findAll(paginateDto);
  }

  @Get('category/:id')
  getCategory(
    @Param('id', ParseIntPipe) categoryId: number,
  ): Promise<Category> {
    return this.categoryService.findOneById(categoryId);
  }
}
