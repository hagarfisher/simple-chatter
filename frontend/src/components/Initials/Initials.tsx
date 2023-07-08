import * as React from "react";
import styles from "./styles.module.scss";
import classnames from "classnames";

type Props = {
  displayName: string;
  variant: "blue" | "yellow";
};

const Initials = ({ displayName, variant = "yellow" }: Props) => {
  const initials = displayName.slice(0, 2);

  return (
    <span
      className={classnames({
        [styles["initials"]]: true,
        [styles[variant]]: true,
      })}
    >
      {initials}
    </span>
  );
};

export default Initials;
