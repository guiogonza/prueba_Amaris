import os

def create_directory(path):
    os.makedirs(path, exist_ok=True)

def create_file(path):
    with open(path, 'w') as f:
        pass

def create_project_structure():
    # Crear directorios principales
    create_directory("my-fund-app")
    create_directory("my-fund-app/backend")
    create_directory("my-fund-app/backend/tests")
    create_directory("my-fund-app/frontend")
    create_directory("my-fund-app/frontend/public")
    create_directory("my-fund-app/frontend/src")
    create_directory("my-fund-app/frontend/src/components")
    create_directory("my-fund-app/frontend/src/services")
    create_directory("my-fund-app/cloudformation")

    # Crear archivos en backend
    create_file("my-fund-app/backend/app.py")
    create_file("my-fund-app/backend/models.py")
    create_file("my-fund-app/backend/routes.py")
    create_file("my-fund-app/backend/requirements.txt")
    create_file("my-fund-app/backend/tests/test_app.py")

    # Crear archivos en frontend
    create_file("my-fund-app/frontend/src/App.js")
    create_file("my-fund-app/frontend/src/index.js")
    create_file("my-fund-app/frontend/package.json")

    # Crear archivos en cloudformation
    create_file("my-fund-app/cloudformation/template.yaml")

    # Crear README.md en la raíz del proyecto
    create_file("my-fund-app/README.md")

    print("Estructura del proyecto creada con éxito.")

if __name__ == "__main__":
    create_project_structure()