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
  
  copied = false;
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
      
      const prompt: string = `
        Translate the following text from ${this.fromLanguage} to ${this.toLanguage}, ensuring that:
        • The meaning is *fully preserved*, avoiding literal translations when necessary.
        • The translation is *contextually accurate* and *conceptually appropriate* for its intended use.
        • Words and phrases align with the *most commonly accepted industry standards* in the target language.
        • Avoid *ambiguous terms, **double meanings*, or words that may have unintended implications in the target market.
        • Use *terminology that a native speaker would naturally use in everyday or professional settings*.
        • Ensure *fluidity and coherence*, making the text feel like it was originally written in the target language.
        Text: "${this.text}"
        Provide only the translation, ensuring clarity, accuracy, and appropriateness.
        `;
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

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }

}
