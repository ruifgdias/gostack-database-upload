import { getRepository } from 'typeorm';
import Category from '../models/Category';

interface CreateCategoryRequest {
  name: string;
}

class CreateCategoryService {
  public async execute({ name }: CreateCategoryRequest): Promise<Category> {
    const categoryRepository = getRepository(Category);

    const category = await categoryRepository.findOne({
      where: { title: name },
    });

    if (category) return category;

    const newCategory = categoryRepository.create({ title: name });
    await categoryRepository.save(newCategory);

    return newCategory;
  }
}
export default CreateCategoryService;
