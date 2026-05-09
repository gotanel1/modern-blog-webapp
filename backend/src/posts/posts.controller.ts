import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Request() req, @Body() createPostDto: any) {
    return this.postsService.create(req.user.userId, createPostDto);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    return this.postsService.findAll(search);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my')
  findMyPosts(@Request() req) {
    return this.postsService.findMyPosts(req.user.userId);
  }

  @Get('id/:id')
  findOneById(@Param('id') id: string) {
    return this.postsService.findOneById(+id);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.postsService.findOneBySlug(slug);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Request() req, @Body() updatePostDto: any) {
    return this.postsService.update(+id, req.user.userId, updatePostDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.postsService.remove(+id, req.user.userId);
  }
}
