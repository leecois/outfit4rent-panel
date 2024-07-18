import { Col, Row, Spin } from 'antd';

import { PackageReviewTable } from '../review-table';
import { TableCategoryPackage } from '../tableCategoryPackage';
import { PackageFormFields } from './fields';
import { usePackageForm } from './usePackageForm';

type Props = {
  action: 'create' | 'edit';
};

export const PackageForm = (props: Props) => {
  const {
    formProps,
    saveButtonProps,
    formLoading,
    isFormDisabled,
    setIsFormDisabled,
    categoryPackageWithCategory,
    packageData,
  } = usePackageForm({
    action: props.action,
  });

  return (
    <Spin spinning={formLoading}>
      <Row gutter={16} wrap>
        <Col xs={24} md={12} lg={9}>
          <PackageFormFields
            formProps={formProps}
            saveButtonProps={saveButtonProps}
            action={props.action}
            isFormDisabled={isFormDisabled}
            setIsFormDisabled={setIsFormDisabled}
          />
        </Col>
        <Col
          xs={24}
          md={12}
          lg={15}
          style={{
            height: props.action === 'create' ? 'calc(100vh - 300px)' : '432px',
            marginTop: '64px',
          }}
        >
          <TableCategoryPackage
            categoryPackageWithCategory={categoryPackageWithCategory}
          />
        </Col>
      </Row>
      {props.action === 'edit' && packageData && (
        <Col span={24} style={{ marginTop: '24px' }}>
          <PackageReviewTable package={packageData} />
        </Col>
      )}
    </Spin>
  );
};
