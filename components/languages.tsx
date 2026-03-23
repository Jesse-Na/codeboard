"use client"

import { basicSetup } from "codemirror";
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { json } from '@codemirror/lang-json';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";


const languageDropdownOptions = [
    { label: "JavaScript", value: "js" },
    { label: "Python", value: "py" },
    { label: "Java", value: "java" },
    { label: "C++", value: "cpp"},
    { label: "JSON", value: "json"},
]

const languageExtensions: { [key: string]: { extension: any, file_ext: string } } = {
    js: {extension: javascript({ jsx: true }), file_ext: '.js'},
    py: {extension: python(), file_ext: '.py'},
    java: {extension: java(), file_ext: '.java'},
    cpp: {extension: cpp(), file_ext: '.cpp'},
    json: {extension: json(), file_ext: '.json'},
};

type LanguageSelectorProps = {
  value: string
  onValueChange: (lang: string) => void
}

export function LanguageSelector({ value, onValueChange }: LanguageSelectorProps) {
  return (
    <Select 
      value={value} 
      onValueChange={onValueChange}
    >
      <SelectTrigger className="w-[180px] h-8">
        <SelectValue placeholder="Language"/>
      </SelectTrigger>
    
      <SelectContent>
        <SelectGroup>
          {languageDropdownOptions.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
      ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}