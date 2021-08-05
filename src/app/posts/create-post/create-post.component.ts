import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { PostService } from '../post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent implements OnInit {
  private mode: number;
  // 1 add
  // 2 edit
  loading = false;
  private id: string;
  form = new FormGroup({
    title: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
    ]),
    content: new FormControl(null, [Validators.required]),
    image: new FormControl(null, [this.fileTypeValidator()]),
    imageThumbnail: new FormControl(null, [Validators.required]),
  });

  constructor(
    private postService: PostService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 2;
        this.id = paramMap.get('id');
        this.postService.getPostById(this.id).subscribe((data) => {
          this.form.patchValue({
            title: data.post.title,
            content: data.post.content,
            imageThumbnail: data.post.imagePath,
            image: null,
          });
          this.loading = false;
        });
      } else {
        this.loading = false;
        this.mode = 1;
        this.id = null;
      }
    });
  }

  onSave() {
    if (!this.form.invalid) {
      this.mode === 1
        ? this.postService.addPost(
            this.form.controls.title.value,
            this.form.controls.content.value,
            this.form.controls.image.value,
          )
        : this.mode === 2
        ? this.postService.updatePost(
            this.id,
            this.form.controls.title.value,
            this.form.controls.content.value,
            this.form.controls.image?.value ||
              this.form.controls.imageThumbnail?.value
          )
        : null;
      this.form.reset;
    }
  }

  onFileAdded(target: HTMLInputElement) {
    this.form.controls.image.patchValue(target.files[0]);
    this.form.controls.image.updateValueAndValidity();
    if (this.form.controls.image.valid) {
      const reader = new FileReader();
      reader.onload = () =>
        this.form.controls.imageThumbnail.setValue(reader.result as string);
      reader.readAsDataURL(this.form.controls.image.value);
    }
  }

  fileTypeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fileType = control.value?.type;
      return !fileType || fileType?.includes('image')
        ? null
        : { incorrectType: fileType };
    };
  }
}
