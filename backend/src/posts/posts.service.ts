import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import slugify from 'slugify';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, data: any) {
    const { title, content, categories, tags, published, coverImage } = data;
    const slug = slugify(title, { lower: true, strict: true });

    return this.prisma.post.create({
      data: {
        title,
        slug,
        content,
        coverImage,
        published: published ?? false,
        author: { connect: { id: userId } },
        categories: {
          connectOrCreate: categories?.map((name: string) => ({
            where: { name },
            create: { name, slug: slugify(name, { lower: true, strict: true }) },
          })),
        },
        tags: {
          connectOrCreate: tags?.map((name: string) => ({
            where: { name },
            create: { name, slug: slugify(name, { lower: true, strict: true }) },
          })),
        },
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        categories: true,
        tags: true,
      },
    });
  }

  async findAll(search?: string) {
    return this.prisma.post.findMany({
      where: search ? {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      } : undefined,
      include: {
        author: { select: { id: true, name: true } },
        categories: true,
        tags: true,
      },
    });
  }

  async findMyPosts(userId: number) {
    return this.prisma.post.findMany({
      where: { authorId: userId },
      include: {
        categories: true,
        tags: true,
      },
    });
  }

  async findOneBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, name: true } },
        categories: true,
        tags: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with slug ${slug} not found`);
    }

    return post;
  }

  async findOneById(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true } },
        categories: true,
        tags: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return post;
  }

  async update(id: number, userId: number, data: any) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('You are not the owner of this post');
    }

    const { title, content, categories, tags, published, coverImage } = data;
    const slug = title ? slugify(title, { lower: true, strict: true }) : undefined;

    return this.prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        coverImage,
        published,
        categories: categories ? {
          set: [],
          connectOrCreate: categories.map((name: string) => ({
            where: { name },
            create: { name, slug: slugify(name, { lower: true, strict: true }) },
          })),
        } : undefined,
        tags: tags ? {
          set: [],
          connectOrCreate: tags.map((name: string) => ({
            where: { name },
            create: { name, slug: slugify(name, { lower: true, strict: true }) },
          })),
        } : undefined,
      },
      include: {
        categories: true,
        tags: true,
      },
    });
  }

  async remove(id: number, userId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('You are not the owner of this post');
    }

    return this.prisma.post.delete({
      where: { id },
    });
  }
}
