import { SetupContext, computed } from 'vue';
import isObject from 'lodash/isObject';
import { TdSelectInputProps, SelectInputChangeContext, SelectInputKeys } from './type';
import TagInput, { TagInputValue } from '../tag-input';
import { SelectInputCommonProperties } from './interface';

export interface RenderSelectMultipleParams {
  commonInputProps: SelectInputCommonProperties;
  onInnerClear: (context: { e: MouseEvent }) => void;
}

const DEFAULT_KEYS = {
  label: 'label',
  key: 'key',
  children: 'children',
};

export default function useMultiple(props: TdSelectInputProps, context: SetupContext) {
  const iKeys = computed<SelectInputKeys>(() => ({ ...DEFAULT_KEYS, ...props.keys }));
  const tags = computed<TagInputValue>(() => {
    if (!(props.value instanceof Array)) {
      return isObject(props.value) ? [props.value[iKeys.value.label]] : [props.value];
    }
    return props.value.map((item) => {
      return isObject(item) ? item[iKeys.value.label] : item;
    });
  });

  const tPlaceholder = computed<string>(() => {
    if (!tags.value || !tags.value.length) return props.placeholder;
    return '';
  });

  const onTagInputChange = (val: TagInputValue, context: SelectInputChangeContext) => {
    // 避免触发浮层的显示或隐藏
    if (context.trigger === 'tag-remove') {
      context.e?.stopPropagation();
    }
    props.onTagChange?.(val, context);
  };

  const renderSelectMultiple = (p: RenderSelectMultipleParams) => {
    return (
      <TagInput
        ref="tagInputRef"
        {...p.commonInputProps}
        v-slots={context.slots}
        autoWidth={props.borderless}
        minCollapsedNum={props.minCollapsedNum}
        collapsedItems={props.collapsedItems}
        tag={props.tag}
        valueDisplay={props.valueDisplay}
        placeholder={tPlaceholder.value}
        value={tags.value}
        onChange={onTagInputChange}
        tagProps={props.tagProps}
        onClear={p.onInnerClear}
        {...props.tagInputProps}
      />
    );
  };

  return {
    tags,
    tPlaceholder,
    renderSelectMultiple,
  };
}
