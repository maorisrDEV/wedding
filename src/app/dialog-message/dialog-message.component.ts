import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export enum STATUS {
  noGuestsNumberAndYes,
  notArrivingAndMoreThenZeroGuest,
  arrivingOK,
  notArrivingOK

}

@Component({
  selector: 'app-dialog-message',
  templateUrl: './dialog-message.component.html',
  styleUrls: ['./dialog-message.component.css']
})
export class DialogMessageComponent implements OnInit {
  STATUS = STATUS;

  constructor(
    public dialogRef: MatDialogRef<DialogMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {status: STATUS, message: any}) {
  }

  ngOnInit(): void {
  }

  onClick(): void {
    this.dialogRef.close();
  }

  onYesNoClick(answer: boolean): void {
    this.dialogRef.close(answer);
  }
}
