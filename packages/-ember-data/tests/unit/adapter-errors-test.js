import EmberError from '@ember/error';

import { module, test } from 'qunit';

import DS from 'ember-data';

import { DEPRECATE_HELPERS } from '@ember-data/private-build-infra/deprecations';
import testInDebug from '@ember-data/unpublished-test-infra/test-support/test-in-debug';

module('unit/adapter-errors - DS.AdapterError', function () {
  test('DS.AdapterError', function (assert) {
    let error = new DS.AdapterError();

    assert.ok(error instanceof Error);
    assert.ok(error instanceof EmberError);
    assert.ok(error.isAdapterError);
    assert.strictEqual(error.message, 'Adapter operation failed');
  });

  test('DS.InvalidError', function (assert) {
    let error = new DS.InvalidError();

    assert.ok(error instanceof Error);
    assert.ok(error instanceof DS.AdapterError);
    assert.ok(error.isAdapterError);
    assert.strictEqual(error.message, 'The adapter rejected the commit because it was invalid');
  });

  test('DS.TimeoutError', function (assert) {
    let error = new DS.TimeoutError();

    assert.ok(error instanceof Error);
    assert.ok(error instanceof DS.AdapterError);
    assert.ok(error.isAdapterError);
    assert.strictEqual(error.message, 'The adapter operation timed out');
  });

  test('DS.AbortError', function (assert) {
    let error = new DS.AbortError();

    assert.ok(error instanceof Error);
    assert.ok(error instanceof DS.AdapterError);
    assert.ok(error.isAdapterError);
    assert.strictEqual(error.message, 'The adapter operation was aborted');
  });

  test('DS.UnauthorizedError', function (assert) {
    let error = new DS.UnauthorizedError();

    assert.ok(error instanceof Error);
    assert.ok(error instanceof DS.AdapterError);
    assert.ok(error.isAdapterError);
    assert.strictEqual(error.message, 'The adapter operation is unauthorized');
  });

  test('DS.ForbiddenError', function (assert) {
    let error = new DS.ForbiddenError();

    assert.ok(error instanceof Error);
    assert.ok(error instanceof DS.AdapterError);
    assert.ok(error.isAdapterError);
    assert.strictEqual(error.message, 'The adapter operation is forbidden');
  });

  test('DS.NotFoundError', function (assert) {
    let error = new DS.NotFoundError();

    assert.ok(error instanceof Error);
    assert.ok(error instanceof DS.AdapterError);
    assert.ok(error.isAdapterError);
    assert.strictEqual(error.message, 'The adapter could not find the resource');
  });

  test('DS.ConflictError', function (assert) {
    let error = new DS.ConflictError();

    assert.ok(error instanceof Error);
    assert.ok(error instanceof DS.AdapterError);
    assert.ok(error.isAdapterError);
    assert.strictEqual(error.message, 'The adapter operation failed due to a conflict');
  });

  test('DS.ServerError', function (assert) {
    let error = new DS.ServerError();

    assert.ok(error instanceof Error);
    assert.ok(error instanceof DS.AdapterError);
    assert.ok(error.isAdapterError);
    assert.strictEqual(error.message, 'The adapter operation failed due to a server error');
  });

  test('CustomAdapterError', function (assert) {
    let CustomAdapterError = DS.AdapterError.extend();
    let error = new CustomAdapterError();

    assert.ok(error instanceof Error);
    assert.ok(error instanceof DS.AdapterError);
    assert.ok(error.isAdapterError);
    assert.strictEqual(error.message, 'Adapter operation failed');
  });

  test('CustomAdapterError with default message', function (assert) {
    let CustomAdapterError = DS.AdapterError.extend({ message: 'custom error!' });
    let error = new CustomAdapterError();

    assert.strictEqual(error.message, 'custom error!');
  });

  if (DEPRECATE_HELPERS) {
    const errorsHash = {
      name: ['is invalid', 'must be a string'],
      age: ['must be a number'],
    };

    const errorsArray = [
      {
        title: 'Invalid Attribute',
        detail: 'is invalid',
        source: { pointer: '/data/attributes/name' },
      },
      {
        title: 'Invalid Attribute',
        detail: 'must be a string',
        source: { pointer: '/data/attributes/name' },
      },
      {
        title: 'Invalid Attribute',
        detail: 'must be a number',
        source: { pointer: '/data/attributes/age' },
      },
    ];

    const errorsPrimaryHash = {
      base: ['is invalid', 'error message'],
    };

    const errorsPrimaryArray = [
      {
        title: 'Invalid Document',
        detail: 'is invalid',
        source: { pointer: '/data' },
      },
      {
        title: 'Invalid Document',
        detail: 'error message',
        source: { pointer: '/data' },
      },
    ];

    test('errorsHashToArray', function (assert) {
      let result = DS.errorsHashToArray(errorsHash);
      assert.deepEqual(result, errorsArray);
      assert.expectDeprecation({ id: 'ember-data:deprecate-errors-hash-to-array-helper', count: 1 });
    });

    test('errorsHashToArray for primary data object', function (assert) {
      let result = DS.errorsHashToArray(errorsPrimaryHash);
      assert.deepEqual(result, errorsPrimaryArray);
      assert.expectDeprecation({ id: 'ember-data:deprecate-errors-hash-to-array-helper', count: 1 });
    });

    test('errorsArrayToHash', function (assert) {
      let result = DS.errorsArrayToHash(errorsArray);
      assert.deepEqual(result, errorsHash);
      assert.expectDeprecation({ id: 'ember-data:deprecate-errors-array-to-hash-helper', count: 1 });
    });

    test('errorsArrayToHash without trailing slash', function (assert) {
      let result = DS.errorsArrayToHash([
        {
          detail: 'error message',
          source: { pointer: 'data/attributes/name' },
        },
      ]);
      assert.deepEqual(result, { name: ['error message'] });
      assert.expectDeprecation({ id: 'ember-data:deprecate-errors-array-to-hash-helper', count: 1 });
    });

    test('errorsArrayToHash for primary data object', function (assert) {
      let result = DS.errorsArrayToHash(errorsPrimaryArray);
      assert.deepEqual(result, errorsPrimaryHash);
      assert.expectDeprecation({ id: 'ember-data:deprecate-errors-array-to-hash-helper', count: 1 });
    });
  }

  testInDebug('DS.InvalidError will normalize errors hash will assert', function (assert) {
    assert.expectAssertion(function () {
      new DS.InvalidError({ name: ['is invalid'] });
    }, /expects json-api formatted errors/);
  });
});
