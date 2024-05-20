import {
  EditOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  RightCircleOutlined,
} from '@ant-design/icons';
import type { UseFormReturnType } from '@refinedev/antd';
import { DeleteButton, ListButton, SaveButton } from '@refinedev/antd';
import type { UseFormProps } from '@refinedev/core';
import { useNavigation, useTranslate } from '@refinedev/core';
import type { InputProps, InputRef } from 'antd';
import {
  Button,
  Card,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  Segmented,
} from 'antd';
import { useEffect, useRef } from 'react';
import InputMask from 'react-input-mask';

import type { IStore } from '../../../interfaces';
import { FormItemEditable, FormItemHorizontal } from '../../form';
import { StoreStatus } from '../status';

type Props = {
  formProps: UseFormReturnType<IStore>['formProps'];
  saveButtonProps: UseFormReturnType<IStore>['saveButtonProps'];
  action: UseFormProps['action'];
  isFormDisabled: boolean;
  setIsFormDisabled: (value: boolean) => void;
  handleAddressChange: (address: string) => void;
};

export const StoreFormFields = ({
  formProps,
  saveButtonProps,
  action,
  isFormDisabled,
  setIsFormDisabled,
  handleAddressChange,
}: Props) => {
  const titleInputRef = useRef<InputRef>(null);

  const t = useTranslate();
  const { list } = useNavigation();

  useEffect(() => {
    if (!isFormDisabled) {
      titleInputRef.current?.focus();
    }
  }, [isFormDisabled]);

  const statusField = Form.useWatch('isActive', formProps.form);

  return (
    <Form {...formProps} layout="horizontal" disabled={isFormDisabled}>
      <FormItemEditable
        formItemProps={{
          name: 'title',
          style: {
            marginBottom: '32px',
          },
          rules: [
            {
              required: true,
            },
          ],
        }}
      >
        <Input
          ref={titleInputRef}
          size="large"
          placeholder={t('stores.fields.title')}
        />
      </FormItemEditable>
      <Card
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <FormItemHorizontal
          name="isActive"
          initialValue={true}
          icon={<RightCircleOutlined />}
          label={t('stores.fields.isActive.label')}
        >
          {isFormDisabled ? (
            <StoreStatus value={statusField} />
          ) : (
            <Segmented
              options={[
                {
                  label: t('stores.fields.isActive.true'),
                  value: true,
                },
                {
                  label: t('stores.fields.isActive.false'),
                  value: false,
                },
              ]}
            />
          )}
        </FormItemHorizontal>
        <Divider
          style={{
            margin: 0,
          }}
        />
        <FormItemHorizontal
          icon={<MailOutlined />}
          label={t('stores.fields.email')}
          name="email"
          rules={[
            {
              required: true,
              type: 'email',
            },
          ]}
        >
          <Input />
        </FormItemHorizontal>
        <Divider
          style={{
            margin: 0,
          }}
        />
        <FormItemHorizontal
          name={['address', 'text']}
          icon={<EnvironmentOutlined />}
          label={t('stores.fields.address')}
          flexProps={{
            align: 'flex-start',
          }}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea
            rows={2}
            onChange={(e) => {
              handleAddressChange(e.target.value);
            }}
          />
        </FormItemHorizontal>
        <Divider
          style={{
            margin: 0,
          }}
        />
        <FormItemHorizontal
          name="gsm"
          icon={<PhoneOutlined />}
          label={t('stores.fields.gsm')}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputMask mask="(999) 999 99 99">
            {/* 
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore */}
            {(props: InputProps) => <Input {...props} />}
          </InputMask>
        </FormItemHorizontal>
      </Card>
      <Flex
        align="center"
        justify="space-between"
        style={{
          padding: '16px 16px 0px 16px',
        }}
      >
        {action === 'create' && (
          <>
            <ListButton icon={false}>{t('actions.cancel')}</ListButton>
            <SaveButton
              {...saveButtonProps}
              style={{
                marginLeft: 'auto',
              }}
              htmlType="submit"
              type="primary"
              icon={null}
            >
              Save
            </SaveButton>
          </>
        )}
        {action === 'edit' &&
          (isFormDisabled ? (
            <>
              <DeleteButton
                type="text"
                onSuccess={() => {
                  list('stores');
                }}
                style={{
                  marginLeft: '-16px',
                }}
              />
              <Button
                style={{
                  marginLeft: 'auto',
                }}
                disabled={false}
                icon={<EditOutlined />}
                onClick={() => {
                  setIsFormDisabled(false);
                }}
              >
                {t('actions.edit')}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => {
                  setIsFormDisabled(true);
                }}
              >
                {t('actions.cancel')}
              </Button>
              <SaveButton
                {...saveButtonProps}
                style={{
                  marginLeft: 'auto',
                }}
                htmlType="submit"
                type="primary"
                icon={null}
              >
                Save
              </SaveButton>
            </>
          ))}
      </Flex>

      {/* this is a workaround for registering fields to ant design form */}
      {/* otherwise these fields will be null */}
      <Flex
        vertical
        style={{
          display: 'none',
        }}
      >
        <Form.Item
          name={['address', 'coordinate', 0]}
          style={{
            display: 'none',
          }}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputNumber
            style={{
              width: '100%',
            }}
            addonBefore="Lat"
          />
        </Form.Item>
        <Form.Item
          style={{
            display: 'none',
          }}
          name={['address', 'coordinate', 1]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputNumber
            addonBefore="Lng"
            style={{
              width: '100%',
            }}
          />
        </Form.Item>
      </Flex>
    </Form>
  );
};
