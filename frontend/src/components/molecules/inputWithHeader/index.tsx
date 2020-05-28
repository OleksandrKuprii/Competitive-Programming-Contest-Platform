import * as React from 'react';
import { FC, memo, Ref } from 'react';
import { Grid } from '@/atoms/grid';
import { Paragraph } from '@/atoms/typography';
import Input from '@/atoms/input';
import Colored from '@/atoms/typography/Colored';

interface InputWithHeaderProps {
  header: string;
  required?: boolean;
  inputRef?: Ref<HTMLInputElement>;
}

const InputWithHeader: FC<InputWithHeaderProps> = ({
  header,
  inputRef,
  required,
}) => {
  return (
    <>
      <Grid justifyContent="center">
        <Paragraph bold style={{ paddingBottom: 10 }}>
          {header}
          {required && (
            <>
              {" "}
              <Colored variant="danger">*</Colored>
            </>
          )}
        </Paragraph>

        <Input ref={inputRef} />
      </Grid>
    </>
  );
};

export default memo(InputWithHeader);
