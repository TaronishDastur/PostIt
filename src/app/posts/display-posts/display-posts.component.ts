import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from 'src/app/shared/post.model';
import { PostService } from '../post.service';
import { takeUntil } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { AuthenticationService } from 'src/app/authentication/authentication.service';

@Component({
  selector: 'app-display-posts',
  templateUrl: './display-posts.component.html',
  styleUrls: ['./display-posts.component.scss'],
})
export class DisplayPostsComponent implements OnInit, OnDestroy {
  posts: Post[];
  postLength: number;
  open = false;
  destroy = new Subject();
  loading = false;
  currentPage = 1;
  currentPageSize = 2;
  isLoggedIn = false;
  currentUserId: string;
  constructor(
    private postService: PostService,
    private authService: AuthenticationService
  ) {}

  ngOnDestroy(): void {
    this.destroy.next();
  }
  ngOnInit(): void {
    this.loading = true;
    this.postService.retrievePosts(this.currentPageSize, this.currentPage);
    this.postService
      .getPosts()
      .pipe(takeUntil(this.destroy))
      .subscribe((post) => {
        this.posts = post;
        console.log(this.posts);
        this.loading = false;
      });
    this.postService
      .getPostLength()
      .pipe(takeUntil(this.destroy))
      .subscribe((len) => (this.postLength = len));
    this.authService
      .getTokenUpdates()
      .pipe(takeUntil(this.destroy))
      .subscribe((val) => {
        this.isLoggedIn = val;
        this.currentUserId = this.authService.getUserId();
        // TODO: look into using the current user as an observable to determine
        //  the current log in status instead of multiple variables
        console.log(this.isLoggedIn, this.currentUserId);
      });
  }

  // TODO bug - when last post on current page is deleted it shows no posts found and removes the paginator
  onDelete(id) {
    this.postService.deletePost(id).subscribe(() => {
      this.postService.retrievePosts(this.currentPageSize, this.currentPage);
    });
  }

  onChangePage(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.currentPageSize = event.pageSize;
    this.postService.retrievePosts(this.currentPageSize, this.currentPage);
  }
}
