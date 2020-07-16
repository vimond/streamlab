import React from 'react';

import { Controlled as CodeMirror } from 'react-codemirror2';

import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/json-lint';
import 'codemirror/mode/javascript/javascript';

// @ts-ignore
import jsonlint from 'jsonlint-mod';
// @ts-ignore
window.jsonlint = jsonlint;

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export const JsonEditor: React.FC<Props> = ({ value, onChange }) => (
  <CodeMirror
    value={value}
    options={{
      mode: 'application/json',
      theme: 'default',
      lineNumbers: true,
      tabSize: 2,
      gutters: ['CodeMirror-lint-markers'],
      lint: value && value.trim()
    }}
    onBeforeChange={(editor, data, newValue) => onChange(newValue)}
  />
);
