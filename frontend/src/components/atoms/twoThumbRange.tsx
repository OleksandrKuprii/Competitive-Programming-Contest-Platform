import * as React from 'react';
import {FC, useState} from "react";
import {getTrackBackground, Range} from "react-range";
import {allColors} from "~/mixins/color";
import {lighten} from "polished";
import styled from "styled-components";
import circle from "~/mixins/circle";
import {AlignItems, Row} from "@/atoms/grid";
import Spacer from "@/atoms/spacer";
import {Padding} from "~/mixins/padding";

interface TwoThumbRangeProps {
  min: number;
  max: number;
  onChange: (v: number[]) => any;
  values: number[];
}

const Thumb = styled.div`
  height: 18px;
  width: 18px;
  background-color: ${allColors.primary};
  
  ${circle};
`;

const Track = styled.div`
  height: 4.5px;
  width: 100%;
  border-radius: 5px;
`;

const ValueLabel = styled.div`
  padding: 1px 3px;
  color: #666;
  font-weight: bold;
`;

const getTrackBackgroundWrapper = (values: number[], min: number, max: number) => () => getTrackBackground({
  values,
  colors: [primaryLighten, allColors.primary, primaryLighten],
  min,
  max,
});

const primaryLighten = `${allColors.primary}61`;

const TwoThumbRange: FC<TwoThumbRangeProps> = ({min, max, onChange, values}) => {
  const getTrackBackground = getTrackBackgroundWrapper(values, min, max);

  return (
    <Row alignItems={AlignItems.Center}>
      <Spacer left={Padding.Normal}/>

      <ValueLabel>{values[0]}</ValueLabel>

      <Spacer left={15 as Padding}/>

      <Range
        onChange={(v) => {
          onChange(v);
        }}
        onFinalChange={onChange}
        min={min}
        max={max}
        values={values}
        renderThumb={({props, index}) =>
          <Thumb style={{...props.style}}/>
        }
        renderTrack={({props, children}) => (
          <Track
            ref={props.ref}
            style={{
              background: getTrackBackground(),
            }}
          >
            {children}
          </Track>
        )}
      />

      <Spacer left={15 as Padding}/>

      <ValueLabel>{values[1]}</ValueLabel>

      <Spacer left={2 as Padding}/>
    </Row>
  );
};

export default TwoThumbRange;
