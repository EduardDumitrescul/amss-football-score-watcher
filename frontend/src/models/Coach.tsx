export interface Coach {
  id: string; // Assuming UUID is treated as a string in JSON
  firstname: string;
  lastname: string;
  // The 'team' property is omitted here, as it's 'mappedBy'
  // and likely not part of the main Coach object in list views.
}