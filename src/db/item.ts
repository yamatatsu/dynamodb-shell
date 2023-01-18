type Attribute = string | number | boolean | { [key: string]: Attribute };
type Attributes = Record<string, Attribute>;

export default class Item {
  private status: "loading" | "error" | "success";
  private attributes: Attributes | null = null;
  private error: Error | null = null;

  constructor(
    public readonly attributesPromise:
      | Promise<Record<string, any> | null>
      | Attributes
  ) {
    if (attributesPromise instanceof Promise) {
      this.status = "loading";
      console.info("loading...");
      attributesPromise.then(
        (attributes) => {
          this.status = "success";
          this.attributes = attributes;
          console.info("loaded.");
          console.info(attributes);
        },
        (error) => {
          this.status = "error";
          this.error = error;
          // console.error(error);
        }
      );
    } else {
      this.status = "success";
      this.attributes = attributesPromise;
    }
  }

  public show() {
    switch (this.status) {
      case "loading":
        console.info("Now loading...");
        return;
      case "error":
        return this.error;
      case "success":
        return this.attributes;
    }
  }
}
