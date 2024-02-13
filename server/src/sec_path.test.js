//INFO: ensure no unsafe path leaks from the internet

//SEE: https://nodejs.org/api/test.html#test-runner
import {describe, it} from 'node:test';
import { strict as assert } from 'node:assert';

process.env.ENV='NO_CONFIG';
import { createApiInstance } from './api_base.js';

const api= createApiInstance();
function pathToSafe(p) {
	const r= api._pathsFromReq({env_name_UNSAFE: 'testEnvName', file_path_UNSAFE: p})
	return r.safe_path;
}

describe('path: no usafe leaks', () => {
  it('no ../ allowed, start', () => {
    assert.strictEqual(pathToSafe('../../file'),'/tmp/x_edited_app/env_testEnvName/src/file');
  });

  it('no . allowed, start', () => {
    assert.strictEqual(pathToSafe('.file'),'/tmp/x_edited_app/env_testEnvName/src/file');
  });

  it('no // allowed, start', () => {
    assert.strictEqual(pathToSafe('//file'),'/tmp/x_edited_app/env_testEnvName/src/file');
  });

  it('no // allowed, middle', () => {
    assert.strictEqual(pathToSafe('ok//file'),'/tmp/x_edited_app/env_testEnvName/src/ok/file');
  });

  it('no // allowed, end', () => {
    assert.strictEqual(pathToSafe('ok/file//'),'/tmp/x_edited_app/env_testEnvName/src/ok/file');
  });

  it('no space allowed', () => {
    assert.strictEqual(pathToSafe('  file space / dir space / a.js'),'/tmp/x_edited_app/env_testEnvName/src/filespace/dirspace/a.js');
  });

  it('no ../ allowed, middle', () => {
    assert.strictEqual(pathToSafe('ok/../../file'),'/tmp/x_edited_app/env_testEnvName/src/ok/file');
  });

  it('no . allowed, middle', () => {
    assert.strictEqual(pathToSafe('ok/.file'),'/tmp/x_edited_app/env_testEnvName/src/ok/file');
  });

  it('no // allowed, middle', () => {
    assert.strictEqual(pathToSafe('ok//file'),'/tmp/x_edited_app/env_testEnvName/src/ok/file');
  });

  it('no ; allowed, middle', () => {
    assert.strictEqual(pathToSafe('ok/file ; cat '),'/tmp/x_edited_app/env_testEnvName/src/ok/filecat');
  });

  it('no : allowed, middle', () => {
    assert.strictEqual(pathToSafe('ok/file : what '),'/tmp/x_edited_app/env_testEnvName/src/ok/filewhat');
  });

  it('no > allowed, middle', () => {
    assert.strictEqual(pathToSafe('ok/file > written '),'/tmp/x_edited_app/env_testEnvName/src/ok/filewritten');
  });
});

describe('path: safe paths ok', () => {
  it('must pass normal', () => {
    assert.strictEqual(pathToSafe('test/File-Name_cool.jsx'),'/tmp/x_edited_app/env_testEnvName/src/test/File-Name_cool.jsx')
  });

  it('must pass two dots', () => {
    assert.strictEqual(pathToSafe('test/two..jsx'),'/tmp/x_edited_app/env_testEnvName/src/test/two..jsx')
  });

});



