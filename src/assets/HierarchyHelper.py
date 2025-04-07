# This Python script is responsible for generating a JSON file describing the
# relationships of the analytes that appear in the methods in AMOS's database.
# The data is displayed in AMOS by a D3-based visualization.

from random import randrange
import pandas as pd
import json

class ClassHierarchy:
  
    def __init__(self, path: str ='L:\\Lab\\NCCT_Richard\\TylerCarr\\AMOS-dictionaries\\analyte_to_AMOSclass.xlsx', sheet_name: str ='Analyte to Class'):
        self.path = path
        self.df = pd.read_excel(io=path, sheet_name=sheet_name)
        
    def check_parent_child_relations(self):
        """Updates missing parent/child relational info in classification spreadsheet.

        e.g., If some node X has child Y, but Y does not have node X as a parent, this code will assign Y parent X.
        """
        df = pd.read_excel(io=self.path, sheet_name="Class Definitions", keep_default_na=False)
        for i, row in df.iterrows():
            class_name = str(row['Class']).strip()
            parents = str(row['Parents']).strip()
            children = str(row['Children']).strip()
            
            # first we ensure that any parents have this node marked as children
            if parents != "None":
                change = False
                for parent in parents.split("; "):
                    new_row = df.loc[df[df['Class'] == parent].index].squeeze()
                    new_children = new_row['Children'].strip().split("; ")
                    if class_name not in new_children:
                        new_children.append(class_name)
                        change = True

                if change:
                    if "None" in new_children:
                        new_children.remove("None")
                    new_children.sort()
                    df.loc[df[df['Class'] == parent].index, "Children"] = "; ".join(new_children)
                
            # Now the reverse
            if children != "None":
                change = False
                for child in children.split("; "):
                    new_row = df.loc[df[df['Class'] == child].index].squeeze()
                    new_parents = str(new_row['Parents']).strip().split("; ")
                    if class_name not in new_parents:
                        new_parents.append(class_name)
                        change = True
                if change:
                    if "None" in new_parents:
                        new_parents.remove("None")
                    new_parents.sort()
                    df.loc[df[df['Class'] == child].index, 'Parents'] = "; ".join(new_parents)
                    
        df.to_excel('./paste_these_to_Analyte_Class_spredsheet.xlsx')
                
    def hierarchy_to_JSON(self) -> None:
        """Generates JSON file with hierachy and link information
        
        Returns:
            None. Generates a JSON file.
            
        Example:
            {"nodes": [
                {"id": "Hydrogen"},
                {"id": "Helium"},
                {"id": "Lithium"}
            }],
            "links": [
                {"target": "Helium",
                "source": "Hydrogen"},
                {"target": "Helium",
                "source": "Lithium"}
            }]}
        """
        df_def = pd.read_excel(io=self.path, sheet_name='Class Definitions', keep_default_na=False)
        out_dict = {"nodes": [], 'links': []}
        
        for i, row in df_def.iterrows():
            # target_r = randrange(10,40) # random radii for now
            target_r = 30
            if row['Parents'] != "None":
                parent_list = [p for p in str(row['Parents']).split('; ')]
                children_list = [c for c in str(row['Children']).split('; ')]
                if children_list[0] == 'None':
                    children_list = "None"
                out_dict["nodes"].append({"id": row['Class'], "r": target_r, 
                                          "type": row['Classification Type'],
                                          "parents": parent_list,
                                          "children": children_list,
                                          "description": row['Definition'],
                                          "url": f"https://amos.sciencedataexperts.com/amos/methods_list?chemical_class=contains_{row['Class'].replace(' ', '%20')}"})
                for p in parent_list:
                    out_dict['links'].append({"target": row['Class'], "source": p, 
                                              "target_r": target_r})
            else:
                children_list = [c for c in str(row['Children']).split('; ')]
                if children_list[0] == 'None':
                    children_list = "None"
                out_dict["nodes"].append({"id": row['Class'], "r": target_r, 
                                          "type": row['Classification Type'],
                                          "parents": "None",
                                          "children": children_list,
                                          "description": row['Definition'],
                                          "url": f"https://amos.sciencedataexperts.com/amos/methods_list?chemical_class=contains_{row['Class'].replace(' ', '%20')}"})
                
        # now export our dictionary as JSON
        with open("analyte_hierarchy.json", "w") as outfile: 
            json.dump(out_dict, outfile)
            
if __name__ == '__main__':
          
    ch = ClassHierarchy()
    # ch.check_parent_child_relations()
    ch.hierarchy_to_JSON()
