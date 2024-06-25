import { Component, Input, Output, EventEmitter, input, OnInit } from '@angular/core';
import { BlogItemImageComponent } from '../blog-item-image/blog-item-image.component';
import { BlogItemTextComponent } from '../blog-item-text/blog-item-text.component';
import { BlogItemTitleComponent } from '../blog-item-title/blog-item-title.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { Post } from '../../models/post';
import { LineComponent } from '../../shared/line/line.component';
import { CommonModule } from '@angular/common';
import { MemoryService } from '../../services/post/memory.service';
import { DataService } from '../../services/data.service';
@Component({
  selector: 'blog-item',
  standalone: true,
  imports: [CommonModule, BlogItemImageComponent, BlogItemTextComponent, BlogItemTitleComponent, ButtonComponent, LineComponent],
  providers: [MemoryService, DataService],
  templateUrl: './blog-item.component.html',
  styleUrl: './blog-item.component.css'
})

export class BlogItemComponent implements OnInit {
  @Input('post-data') postData?: Post;
  @Input() id?: string;
  @Output() onLikeChange = new EventEmitter<number>();
  @Output() onGoToPost = new EventEmitter<string>();

  public title: string = "";
  public text: string = "";
  public image: string = "";
  public likes: number = 0;
  public dislikes: number = 0;

  public copied = false;

  constructor(public memory: MemoryService, private dataService: DataService){}

  ngOnInit(): void {
    this.title = this.postData?.title ?? this.title;
    this.text = this.postData?.text ?? this.text;
    this.image = this.postData?.image ?? this.image;
    this.likes = this.postData?.likes ?? this.likes;
    this.dislikes = this.postData?.dislikes ?? this.dislikes

    if(this.id == undefined) {
      return;
    }
    const memeoryLike = this.memory.memoryGetLikeForPost(this.id);
    if(memeoryLike) {
      this.liked = true;
    } else if(memeoryLike != null) {
      this.disliked = true;
    }

  }

  public liked: boolean = false;
  public disliked: boolean = false;

  public goToPost() {
    this.onGoToPost.emit(this.getPath());
  }

  public share() {
    console.log("SHARE http://localhost:4200" + this.getPath());
    this.copied = true;

    setTimeout(() => {
      this.copied = false;
    }, 2000)
  }

  public like($event: boolean, like: boolean) {
    const change = {
      like: 0,
      dislike: 0
    }
    
    if(this.id==undefined) {
      return;
    }

    if(like) {
      // Post liked
      this.liked = $event;
      change.like = ($event) ? 1 : -1;
      if(this.liked && this.disliked) {
        this.disliked = false;
        change.dislike = -1;
      }
    } else {
      // Post disliked
      this.disliked = $event;
      change.dislike = ($event) ? 1 : -1;
      if(this.disliked && this.liked) {
        this.liked = false;
        change.like = -1;
      }
    }

    const id = this.id;

    this.dataService.likePost(id, change.like, change.dislike)
      .subscribe((res) => {
        let store: boolean | null = null;
        console.log(change);

        const sum = change.like + change.dislike;
        
        if(sum > 0) {
          if(change.like == 1) {
            store = true;
          } else {
            store == false;
          }
        }

        this.memory.storeLikes(id, store);
        this.likes += change.like;
        this.dislikes += change.dislike;
      }

      );
  }

  public getPath(): string {
    return '/blog/details/' + this.id;
  }

  public getValue(num: number): string {
    return String(num);
  }

  public getMemoryLike(isDlislike = false): boolean {
    if(this.id == undefined) {
      return false;
    }

    const like = this.memory.memoryGetLikeForPost(this.id);
    console.log(this.id, like);
    

    if(like == null) {return false;}

    return (isDlislike) ? !like: like ;
  }
}
