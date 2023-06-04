import React from "react";

// Props are immutable
interface Props {
  item: string[];
  heading: String;
  onSelectedItem: (item: string) => void;
}

export default function TestProps({ item, heading, onSelectedItem }) {
  let value = "my_value";

  return (
    <>
      <h6
        onClick={(e) => {
          console.log(`Item clicked !`);
          onSelectedItem();
        }}
      >
        Test Props = {item}{" "}
      </h6>
    </>
  );
}
