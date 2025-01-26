import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import OpenAI from 'openai';
import { ChatCompletion } from 'openai/resources/index.mjs';

@Component({
  selector: 'app-translate',
  imports: [FormsModule, CommonModule],
  templateUrl: './translate.component.html',
  styleUrl: './translate.component.scss',
  standalone: true
})
export class TranslateComponent {
  text: string = '';
  fromLanguage: string = '';
  toLanguage: string = '';
  isLoading: boolean = false;
  translatedText: string | null = null;

  constructor() { }


  async translate() {
    const openAIToken = localStorage.getItem('token');
    if (!openAIToken) {
      alert('No OpenAI token found. Please log in again.');
      return;
    }
    try {
      this.isLoading = true;
      const client = new OpenAI({ apiKey: openAIToken, dangerouslyAllowBrowser: true });
      const prompt: string = `Translate the following text from ${this.fromLanguage} to ${this.toLanguage}:\n\n${this.text}`;
      const response: ChatCompletion = await client.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-4o',
      });
      console.log('Response from OpenAI', response);
      if (!response.choices || !response.choices[0]) {
        console.error('No response from OpenAI', response);
        alert('No response from OpenAI');
        return;
      } else {
        this.translatedText = response.choices[0].message?.content?.trim() || null;
      }
      this.isLoading = false;
    } catch (error) {
      console.error('Translation failed', error);
      alert('Translation failed');
    }
  }

  isTranslateDisabled(): boolean {
    return !this.text || !this.fromLanguage || !this.toLanguage || this.isLoading;
  }

}
